import styles from "../css/ClassPreference.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "./Button";
import dragHandle from "../assets/dragHandle.svg";
const ClassPreference = ({ classes, removeClass, setReorderedClasses }) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const [reorderedItem] = classes.splice(result.source.index, 1);
    classes.splice(result.destination.index, 0, reorderedItem);
    setReorderedClasses(classes);
  };
  return (
    <div className={styles.container}>
      <div className={styles.classPriority}>
        <div className={`${styles.title} body1-bold`}>Class Priority</div>
        <div className={styles.addedClasses}>
          <div className={styles.resultsWrapper}>
            {classes?.length > 0 ? (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="classes-priority-list">
                  {(provided) => (
                    <ul
                      key={"classes-list"}
                      className={styles.classesList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {classes?.map((classData, index) => {
                        return (
                          <Draggable
                            draggableId={`${classData["CLASS ID"]}-priority-select`}
                            key={`${classData["CLASS ID"]}-priority-select`}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                key={`${classData["CLASS ID"]}-priority-select-c`}
                                className={`${styles.class}`}
                                {...provided.draggableProps}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className={styles.handle}
                                >
                                  <img src={dragHandle} alt="drag" />
                                </div>
                                <div className={styles.classContent}>
                                  <div
                                    className={`${styles.facultyName} body1-bold`}
                                  >
                                    {classData["EMPLOYEE NAME"]}
                                  </div>
                                  <a
                                    className={styles.delete}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeClass(classData);
                                    }}
                                  >
                                    X
                                  </a>
                                  <div className={styles.erpId}>
                                    {classData["ERP ID"]}
                                  </div>
                                  <div className={styles.classSlots}>
                                    {classData["SLOT"]}
                                  </div>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <></>
            )}
            {/* {classes?.map((classData) => {
              return (
                <div
                  className={styles.class}
                  key={`selected-class-${classData["CLASS ID"]}`}
                ></div>
              );
            })} */}
          </div>
          <Button
            classes={styles.addClassesButton}
            type="primary"
            href="#class-selection-section"
          >
            ADD CLASSES +
          </Button>
          <div className={styles.buttons}>
            <Button
              type="clear"
              onClick={() => {
                classes.forEach((classData) => removeClass(classData));
              }}
            >
              CLEAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPreference;
