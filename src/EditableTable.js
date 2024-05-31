import React, { useState, useRef, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import "tabulator-tables/dist/css/tabulator.min.css";
import "react-tabulator/lib/styles.css";
import "./EditableTable.css";

const EditableTable = () => {
  const [data, setData] = useState([
    { id: 1, name: "John", age: 28, gender: "Male", checkbox: false, rating: 4.5, editable: false },
    { id: 2, name: "Jane", age: 32, gender: "Female", checkbox: false, rating: 4.0, editable: false},
    { id: 3, name: "Harish", age: 26, gender: "Male", checkbox: false, rating: 4.5, editable: false},
    { id: 4, name: "Kani", age: 29, gender: "Male", checkbox: false, rating: 4.0, editable: false},
    { id: 5, name: "Madhu", age: 35, gender: "Male", checkbox: false, rating: 4.5, editable: false },
    { id: 6, name: "Vignesh", age: 25, gender: "Male", checkbox: false, rating: 4.0, editable: false },
    { id: 7, name: "Mari", age: 28, gender: "Male", checkbox: false, rating: 4.5, editable: false },
    { id: 8, name: "saatty", age: 25, gender: "Male", checkbox: false, rating: 4.0, editable: false },
    { id: 9, name: "Su", age: 26, gender: "Male", checkbox: false, rating: 4.5,editable: false },
    { id: 10, name: "Ashwin", age: 26, gender: "Male", checkbox: false, rating: 4.6, editable: false },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const tableRef = useRef(null);

  const editCheck = function(cell){
    var data = cell.getRow().getData();
    return data.editable;
  };

  const columns = [
    {
      formatter: (cell, formatterParams, onRendered) => {
        const rowData = cell.getRow().getData();
        const isChecked = rowData.checkbox ? "checked" : "";
        return `<input type="checkbox" ${isChecked} />`;
      },
      field: "checkbox",
      headerVisible: false,
      titleFormatter: function () {
        return "<input type='checkbox' id='header-check' />";
      },
      hozAlign: "center",
      headerSort: false,
      headerClick: function (e, column) {
        const headerCheckbox = document.getElementById("header-check");
        const alteredData = data.map((rowData) => {
          rowData.checkbox = !rowData.checkbox;
          return rowData;
        });
        setData(alteredData);
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
      headerFilterFunc: "=",
    },
    {
      title: "Rating",
      field: "rating",
      headerFilter: "input",
      editor: "input",
      editable: editCheck,
    },];


  const handleRowSelection = (selectData) => {
    setEditMode(false);
    const selectedIds = selectData.filter(data => data.checkbox).map(t=>t.id);
    console.log(selectedIds);
    setSelectedRows([...selectedIds]);
  };

  const handleEdit = () => {
    setData((prevData) => {
      return prevData.map((row) => {
        if (selectedRows.includes(row.id)) {
          return { ...row, editable: true };
        }
        return row;
      });
    })
  };

  const handleSave = () => {
    setEditMode(false);
    setData((prevData) => {
      return prevData.map((row) => ({ ...row, editable: false }));
    });
  };

  const handleUndo = () => {
    setEditMode(false);
    setData((prevData) => {
      return prevData.map((row) => ({ ...row, editable: false }));
    });
  };

  const events = {
    rowClick: (e, row) => {
      const checkboxCell = row.getCell("checkbox");
      const checkboxInput = checkboxCell.getElement().querySelector('input[type="checkbox"]');
      const res = row.getData()
      if (e.target === checkboxInput) {
        const alteredData = data.map((rowData) => {
          if (res.id == rowData.id) {
            rowData.checkbox = !rowData.checkbox;
          }
          return rowData;
        });
        setData(alteredData)
    }
  },
    cellClick: (e, cell) => {
      if (cell.getColumn().getField() !== "checkbox") {
        console.log("Cell clicked:", cell.getField(), cell.getValue());
      }
    },
    rowSelectionChanged: (data, rows) => {
      handleRowSelection(data);
    },
    cellEdited: (cell) => {
      console.log("cellEdited", cell);
    },
  };

  useEffect(()=>{
    handleRowSelection(data)
  },[data])

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
              {row.id} - {row.name} - {row.age} - {row.editable.toString()}
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
