import React, { useEffect, useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";
import ClassTable from "./ClassTable";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import cameraImg from "../assets/camera.svg";

const Timetables = ({ schedules, slots, classes }) => {
  // console.log("rerendering Timetables(", schedules, slots, faculties, ")");
  const [selectedClasses, setSelectedClasses] = useState({});
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const courseIDs = schedules?.length > 0 ? Object.keys(schedules[0]) : [];
  useEffect(() => {
    setHoveredSlots([]);
  }, [slots]);
  const isUnique = (fieldName, array, element) => {
    return !array.some(
      (currentElement) => currentElement[fieldName] === element[fieldName]
    );
  };
  const getScore = (courseID, classData) => {
    return (
      (classes[courseID]?.length -
        classes[courseID]?.findIndex(
          (_classData) => _classData["CLASS ID"] === classData["CLASS ID"]
        )) /
      classes[courseID]?.length
    );
  };
  const hiddenClone = (element) => {
    // Create clone of element
    var clone = element.cloneNode(true);

    // Position element relatively within the
    // body but still out of the viewport
    // document.querySelector().style.z
    var style = clone.style;
    style.position = "relative";
    // style.top = window.innerHeight + "px";
    style.left = 0;
    style.zIndex = 10000;
    clone.id = element.id + "clone";

    // Append clone to body and return the clone
    // document..appendChild(clone);
    // document.body.firstChild.after(clone);
    document.querySelector("#root").firstChild.after(clone);
    // clone.scrollIntoView();
    return clone;
  };
  const getCanvasFromNode = async (node) => {
    // Clone off-screen element
    const clone = hiddenClone(node);
    // clone?.scrollIntoView({ behavior: "smooth" });
    const canvas = await html2canvas(clone, {
      // allowTaint: true,
      // backgroundColor: "#000",
      // foreignObjectRendering: true,
      // logging: true,
      // useCORS: true,
      scrollY: -window.scrollY,
    });
    clone.parentNode.removeChild(clone);
    return canvas;
  };
  const getScalingFactor = (width, height, maxWidth, maxHeight) => {
    console.log(width, height, maxWidth, maxHeight);
    const fr1 = maxWidth / width;
    const fr2 = maxHeight / height;
    if (fr1 >= 1 && fr2 >= 1) return 1;
    return fr1 < fr2 ? fr1 : fr2;
  };
  const hasValidSelections = () => {
    const currentSchedules = schedules[slots.join("+")];
    if (currentSchedules === undefined || currentSchedules[0] === undefined)
      return false;
    const courseIDs = Object.keys(currentSchedules[0]);
    const facultiesByCourseCode = {};
    console.log({ currentSchedules });
    courseIDs.forEach((courseID) => {
      // const courseCode = currentSchedules[courseID][0][ "COURSE CODE" ]
      // const courseType = currentSchedules[courseID][0][ "COURSE TYPE" ]
      const [courseCode, courseType] = courseID.split("-");
      if (facultiesByCourseCode[courseCode] === undefined)
        facultiesByCourseCode[courseCode] = {};
      if (facultiesByCourseCode[courseCode][courseType] === undefined)
        facultiesByCourseCode[courseCode][courseType] = new Set();
      // facultiesByCourseCode[courseCode][courseType].push(currentSchedules)
      currentSchedules.forEach((schedule) =>
        facultiesByCourseCode[courseCode][courseType].add(
          schedule[courseID]["ERP ID"]
        )
      );
    });
    for (const courseCode of Object.keys(facultiesByCourseCode)) {
      const faculties = new Set();
      let totalFacultiesInEachComponent = 0;
      for (const courseType of Object.keys(facultiesByCourseCode[courseCode])) {
        facultiesByCourseCode[courseCode][courseType].forEach((erpID) =>
          faculties.add(erpID)
        );
        totalFacultiesInEachComponent +=
          facultiesByCourseCode[courseCode][courseType].size;
      }
      if (faculties.size < totalFacultiesInEachComponent) continue;
      else return false;
    }
    return true;
  };
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      <Timetable
        selectedClasses={selectedClasses}
        slots={slots}
        hoveredSlots={hoveredSlots}
        classes={classes}
        hasValidSelections={hasValidSelections}
      ></Timetable>
      {slots !== undefined && slots.length > 0 ? (
        <>
          <div className={styles.buttons}>
            <input
              type="image"
              src={cameraImg}
              alt="Download timetable image"
              onClick={async () => {
                const table = document.getElementById("filled-out-timetable");
                // console.log("clicked", courseIDs, schedules, selectedClasses);
                // const courseIDs = Object.keys(selectedClasses);
                const selectedSchedules = schedules[slots.join("+")];
                const courseIDs =
                  selectedSchedules?.length > 0
                    ? Object.keys(selectedSchedules[0])
                    : [];
                const classes = {};
                selectedSchedules?.forEach((schedule) =>
                  courseIDs?.forEach((courseID) => {
                    if (classes[courseID] === undefined) classes[courseID] = [];
                    if (
                      isUnique(
                        "CLASS ID",
                        classes[courseID],
                        schedule[courseID]
                      )
                    )
                      classes[courseID].push(schedule[courseID]);
                  })
                );
                courseIDs.sort((a, b) => classes[b].length - classes[a].length);
                const canvases = [await getCanvasFromNode(table)];

                for (const courseID of courseIDs) {
                  console.log("clicked", courseID);
                  const Table = () => (
                    <ClassTable
                      courseIDs={courseIDs}
                      schedules={selectedSchedules}
                      courseID={courseID}
                      selectedClasses={selectedClasses}
                      slots={slots}
                      getScore={getScore}
                    ></ClassTable>
                  );

                  const node = document.createElement("div");
                  node.style.display = "flex";
                  node.style.flexDirection = "column";
                  node.style.alignItems = "center";

                  ReactDOM.render(<Table />, node);
                  const canvas = await getCanvasFromNode(node);
                  console.log(canvas, node);
                  canvases.push(canvas);
                }

                const dataURLs = canvases.map((canvas) =>
                  canvas.toDataURL("image/png")
                );
                const height = 793.706;
                const width = 1122.52;
                const pdf = new jsPDF({
                  unit: "px",
                  hotfixes: ["px_scaling"],
                  orientation: "landscape",
                });
                // let currentHeight = 30
                canvases.forEach((canvas, index) => {
                  const sf = getScalingFactor(
                    canvas.width,
                    canvas.height,
                    width,
                    height
                  );
                  pdf.addImage(
                    dataURLs[index],
                    "PNG",
                    width / 2 - (canvas.width * sf) / 2,
                    height / 2 - (canvas.height * sf) / 2,
                    canvas.width * sf,
                    canvas.height * sf
                  );
                  pdf.addPage();
                });
                pdf.deletePage(pdf.getNumberOfPages());
                pdf.save(`timetable-${slots.join("+")}.pdf`);
                const elements = [];
                elements.push(document.getElementById("filled-out-timetable"));
              }}
            />
          </div>
          <Classes
            schedules={schedules[slots.join("+")]}
            slots={slots}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
            setHoveredSlots={setHoveredSlots}
            getScore={getScore}
            isUnique={isUnique}
          ></Classes>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Timetables;
