import React, { useState, useEffect, useRef } from "react";
import { ReactTabulator } from 'react-tabulator';
import "tabulator-tables/dist/css/tabulator.min.css";
import "react-tabulator/lib/styles.css";
import "./EditableTable.css";

const EditableTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const tableRef = useRef(null);

  const columns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      cellClick: (e, cell) => {
        cell.getRow().toggleSelect();
      },
    },
    { title: "Name", field: "name", headerFilter: "input", editor: "input" },
    { title: "Age", field: "age", headerFilter: "input", editor: "input" },
    {
      title: "Gender",
      field: "gender",
      headerFilter: "select",
      headerFilterParams: { values: ["", "Male", "Female"] },
      editor: "select",
      editorParams: { values: ["Male", "Female"] },
    },
    {
      title: "Rating",
      field: "rating",
      headerFilter: "input",
      editor: "input",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const result = [
          { id: 1, name: "John", age: 28, gender: "Male", rating: 4.5 },
          { id: 2, name: "Jane", age: 32, gender: "Female", rating: 4.0 },
          { id: 3, name: "Harish", age: 26, gender: "Male", rating: 4.5 },
          { id: 4, name: "Kani", age: 29, gender: "Male", rating: 4.0 },
          { id: 5, name: "Madhu", age: 35, gender: "Male", rating: 4.5 },
          { id: 6, name: "Vignesh", age: 25, gender: "Male", rating: 4.0 },
          { id: 7, name: "Mari", age: 28, gender: "Male", rating: 4.5 },
          { id: 8, name: "saatty", age: 25, gender: "Male", rating: 4.0 },
          { id: 9, name: "Su", age: 26, gender: "Male", rating: 4.5 },
          { id: 10, name: "Ashwin", age: 26, gender: "Male", rating: 4.6 },
        ];
        setData(result);
      }, 100);
    };
    fetchData();
  }, []);

  const handleRowSelection = (selectedData) => {
    setEditMode(false);
    setSelectedRows(selectedData);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const handleUndo = () => {
    setEditMode(false);
  };

  const events = {
    rowClick: (e, row) => {
      console.log("Row clicked:", row.getData());
    },
    cellClick: (e, cell) => {
      if (cell.getColumn().getField() !== undefined) {
        e.stopPropagation();
      }
      console.log("Cell clicked:", cell.getField(), cell.getValue());
    },
    rowSelectionChanged: (data, rows) => {
      console.log("Selected rows:", data);
      handleRowSelection(data);
    },
    cellEdited: (cell) => {
      console.log("cellEdited", cell);
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
          <button id="save-button" onClick={handleSave} disabled={!editMode}>
            Save
          </button>
          <button id="undo-button" onClick={handleUndo} disabled={!editMode}>
            Undo
          </button>
        </div>
      )}

      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={data}
        layout="fitColumns"
        selectable={true}
        events={events}
        options={{
          headerFilterPlaceholder: "Filter...",
          headerSortTristate: true,
          movableRows: true,
          pagination:"local",
          paginationSize: 3,
        }}
      />
    </div>
  );
};

export default EditableTable;
