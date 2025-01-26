import React, { useEffect, useState } from "react";
import { useFirebase } from "src/context/Firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const StudentData = () => {
  const firebase = useFirebase();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch student data from Firestore
    firebase.listStudentData().then((docs) => {
      const studentList = docs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    });
  }, [firebase]);

  // Open the dialog for viewing or editing
  const handleOpenDialog = (student, isEdit) => {
    setSelectedStudent(student);
    setFormData(student);
    setEditMode(isEdit);
    setOpenDialog(true);
  };

  // Handle input change in edit mode
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update student data
  const handleUpdate = async () => {
    await firebase.updateStudent(selectedStudent.id, formData);
    setStudents(students.map((s) => (s.id === selectedStudent.id ? { ...s, ...formData } : s)));
    setOpenDialog(false);
  };

  // Delete student
  const handleDelete = async (studentID) => {
    await firebase.deleteStudent(studentID);
    setStudents(students.filter((student) => student.id !== studentID));
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Class</b></TableCell>
              <TableCell><b>Section</b></TableCell>
              <TableCell><b>Roll Number</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.studentID}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(student, false)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(student, true)} color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editMode ? "Edit Student" : "View Student"}</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key] || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              disabled={!editMode}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Close</Button>
          {editMode && <Button onClick={handleUpdate} color="primary">Update</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentData;
