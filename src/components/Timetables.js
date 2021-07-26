import { useEffect, useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";
import ClassTable from "./ClassTable";
import html2canvas from "html2canvas";
import cameraImg from "../assets/camera.svg";
import {
  Page,
  View,
  Document,
  PDFDownloadLink,
  Text,
} from "@react-pdf/renderer";

const Timetables = ({ schedules, slots, classes }) => {
  // console.log("rerendering Timetables(", schedules, slots, faculties, ")");
  const [selectedClasses, setSelectedClasses] = useState({});
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const courseIDs = schedules?.length > 0 ? Object.keys(schedules[0]) : [];
  useEffect(() => {
    setHoveredSlots([]);
  }, [slots]);
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
  // const PDFDoc = () => (
  //   <Document>
  //     <Page>
  //       <View wrap={false}>
  //         {/* <Timetable
  //           selectedClasses={selectedClasses}
  //           slots={slots}
  //           hoveredSlots={hoveredSlots}
  //           classes={classes}
  //         ></Timetable> */}
  //         <Text>Table</Text>
  //       </View>
  //       {courseIDs.map((courseID) => (
  //         <View
  //           wrap={false}
  //           key={`${slots.join("")}-${courseID}-pdf-class-table`}
  //         >
  //           <Text>{courseID}</Text>

  //           {/* <ClassTable
  //             getScore={getScore}
  //             courseIDs={courseIDs}
  //             schedules={schedules}
  //             courseID={courseID}
  //             selectedClasses={selectedClasses}
  //             slots={slots}
  //           ></ClassTable> */}
  //         </View>
  //       ))}
  //     </Page>
  //   </Document>
  // );
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      <Timetable
        selectedClasses={selectedClasses}
        slots={slots}
        hoveredSlots={hoveredSlots}
        classes={classes}
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
                const canvas = await getCanvasFromNode(table);

                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/png");
                a.download = `timetable-${slots.join("+")}.png`;
                a.click();
                // TODO: Get canvases for each class table and make pdf for user to download
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
          ></Classes>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Timetables;
