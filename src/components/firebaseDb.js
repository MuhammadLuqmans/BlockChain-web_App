import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";

function TaskManager({ onDownload, admin, UserAddress, product }) {
  const [tasks, setTasks] = useState([]);

  console.log(admin, product);

  useEffect(() => {
    const taskColRef = query(
      collection(db, "web3File_Urls"),
      orderBy("created", "desc")
    );
    onSnapshot(taskColRef, (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const handleDelete = async (id) => {
    const taskDocRef = doc(db, "web3File_Urls", id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

  console.log("task", tasks);

  return (
    <>
          {tasks.map((task, idx) => {
            console.log(task.data.fileUrl.substring(0, 3));
            console.log(task.data.fileUrl.slice(task.data.fileUrl.length - 3));
            return (
              <tr key={idx} className="d-flex" style={{ gap: "10px" }}>
                <td className="d-flex">
                  <button
                    key={task.id}
                    data-toggle="tooltip"
                    title={task.data.fileUrl}
                    onClick={() => {
                      if (admin === UserAddress && !product) {
                        onDownload(`${task.data.fileUrl}`);
                      } else {
                        alert("please Buy");
                      }
                    }}
                    className="btn btn-text border-primary"
                    style={{ width: "100px", marginRight: "10px" }}
                  >
                    {task.data.fileUrl.substring(0, 3)}...
                    {task.data.fileUrl.slice(task.data.fileUrl.length - 3)}
                  </button>
                  <button
                    className="btn btn-primary"
                    data-toggle="tooltip"
                    onClick={() => handleDelete(task.id)}
                    title="Delete"
                    style={{
                      color: "#fff",
                      display: admin === UserAddress ? "flex" : "none",
                    }}
                  >
                    <img src="./Delete.svg" />
                  </button>
                </td>
              </tr>
            );
          })}
    </>
  );
}

export default TaskManager;
