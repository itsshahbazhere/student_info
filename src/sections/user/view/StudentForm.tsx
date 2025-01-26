import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useFirebase } from 'src/context/Firebase';

interface StudentFormProps {
  onClose: () => void;  // Defining the type of onClose
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose }) => {
  const firebase = useFirebase();
  const [formData, setFormData] = useState({
    studentID: '',
    name: '',
    class: '',
    section: '',
    rollNumber: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const studentData = formData;

    // Add the student to Firebase
    await firebase.createStudent(studentData);

    console.log('Student Data Submitted:', formData);
    onClose(); // Close the modal after submitting
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom align="center">
        Student Information Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Student ID"
          name="studentID"
          value={formData.studentID}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Class"
          name="class"
          value={formData.class}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Gender"
          name="gender"
          select
          value={formData.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Zip Code"
          name="zipCode"
          type="number"
          value={formData.zipCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default StudentForm;
