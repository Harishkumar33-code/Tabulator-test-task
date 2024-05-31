import React, { useState, useRef } from "react";
import { ReactTabulator } from "react-tabulator";
import "tabulator-tables/dist/css/tabulator.min.css";
import "react-tabulator/lib/styles.css";
import "./EditableTable.css";

const EditableTable = () => {
  const [data, setData] = useState([
    { id: 1, name: "John", age: 28, gender: "Male", rating: 4.5, editable: false },
    { id: 2, name: "Jane", age: 32, gender: "Female", rating: 4.0, editable: false},
    { id: 3, name: "Harish", age: 26, gender: "Male", rating: 4.5, editable: false},
    { id: 4, name: "Kani", age: 29, gender: "Male", rating: 4.0, editable: false},
    { id: 5, name: "Madhu", age: 35, gender: "Male", rating: 4.5, editable: false },
    { id: 6, name: "Vignesh", age: 25, gender: "Male", rating: 4.0, editable: false },
    { id: 7, name: "Mari", age: 28, gender: "Male", rating: 4.5, editable: false },
    { id: 8, name: "saatty", age: 25, gender: "Male", rating: 4.0, editable: false },
    { id: 9, name: "Su", age: 26, gender: "Male", rating: 4.5,editable: false },
    { id: 10, name: "Ashwin", age: 26, gender: "Male", rating: 4.6, editable: false },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [backupData, setBackupData] = useState([]);
  const tableRef = useRef(null);

  const editCheck = function(cell){
    var data = cell.getRow().getData();
    return data.editable;
  };

  const columns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      rowHandle: true,
      cellClick: (e, cell) => {
        e.stopPropagation(); 
        cell.getRow().toggleSelect();
      },
    },
    { title: "Name", field: "name", headerFilter: "input", editor: "input", editable: editCheck},
    { title: "Age", field: "age", headerFilter: "input", editor: "input",editable: editCheck},
    {
      title: "Gender",
      field: "gender",
      headerFilter: "select",
      headerFilterParams: { values: ["", "Male", "Female"] },
      editor: "input",
      editable: editCheck,
      editorParams: { values: ["Male", "Female"] },
    },
    {
      title: "Rating",
      field: "rating",
      headerFilter: "input",
      editor: "input",
      editable: editCheck,
    },];


  const handleRowSelection = (selectedData) => {
    setEditMode(false);
    const selectedIds = selectedData.map(data => data.id);
    setSelectedRows([...selectedIds]);
  };

  const handleEdit = () => {
    setData((prevData) => {
      return prevData.map((row) => {
        if (selectedRows.includes(row.id)) {
          setBackupData([backupData, row]);
          return { ...row, editable: true };
        }
        return row;
      });
    })
  };

  const handleSave = () => {
    setEditMode(false);
    setBackupData([]);
    setData((prevData) => {
      return prevData.map((row) => ({ ...row, editable: false }));
    });
  };

  const handleUndo = () => {
    console.log("in undo");
    setEditMode(false);
    setData((prevData) => {
      return prevData.map((row) => {
        if (backupData.map((data) => data.id).includes(row.id)) {
          return backupData.find((data) => data.id === row.id);
        }
        return row;
      });
    });
  };

  const events = {
    rowClick: (e, row) => {
      e.preventDefault();
      console.log("Row clicked:", row.getData());
    },
    cellClick: (e, cell) => {
      if (cell.getColumn().getField() !== "checkbox") {
        console.log("Cell clicked:", cell.getRow().getData());
      }
    },
    rowSelectionChanged: (data, rows) => {
      handleRowSelection(data);
    },
    cellEdited: (cell) => {
      console.log("cellEdited", cell.getRow().getData());
    },
  };


  return (
    <div>
      <div>TABULATOR</div>
      {selectedRows.length > 0 && (
        <div className="action-buttons">
          <button id="edit-button" onClick={handleEdit} disabled={editMode}>
            {selectedRows.length > 1 ? "Multi Edit" : "Edit"}
          </button>
          <button id="save-button" onClick={handleSave} disabled={editMode}>
            Save
          </button>
          <button id="undo-button" onClick={handleUndo} disabled={editMode}>
            Undo
          </button>
        </div>
      )}
      {
        selectedRows
      }
      {
        data.map((row) => {
          return (
            <div key={row.id}>
              {row.id} - {row.name} - {row.age} -{row.gender}- {row.editable.toString()}
            </div>
          );
      }
      )}
      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={data}
        layout="fitColumns"
        selectable={false}
        events={events}
        options={{
          headerFilterPlaceholder: "Filter...",
          headerSortTristate: true,
          movableRows: true,
          pagination: "local",
          paginationSize: 3,

        }}
      />
    </div>
  );
};

export default EditableTable;
