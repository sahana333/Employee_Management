import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './Form.css';
import axios from 'axios';

interface FormData {
    employeeName: string;
    employeeId: string;
    email: string;
    phoneNumber: string;
    department: string;
    dateOfJoining: string;
    role: string;
}

interface FormErrors {
    employeeName?: string;
    employeeId?: string;
    email?: string;
    phoneNumber?: string;
    department?: string;
    dateOfJoining?: string;
    role?: string;
}

const EmployeeForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        employeeName: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        department: '',
        dateOfJoining: '',
        role: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [employees, setEmployees] = useState<FormData[]>([]);

    // Fetch employee list when component is mounted
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employee list:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Check if the employeeId already exists
                const existingEmployee = employees.find(emp => emp.employeeId === formData.employeeId);

                if (existingEmployee) {
                    // Update employee if employeeId already exists
                    await axios.put(`http://localhost:5000/api/employees/${formData.employeeId}`, formData);
                    alert('Employee updated successfully!');
                } else {
                    // Submit new employee if employeeId does not exist
                    await axios.post('http://localhost:5000/api/employees', formData);
                    alert('Employee data submitted successfully!');
                }

                // Reset form data
                setFormData({
                    employeeName: '',
                    employeeId: '',
                    email: '',
                    phoneNumber: '',
                    department: '',
                    dateOfJoining: '',
                    role: '',
                });

                // Fetch the updated employee list
                const updatedEmployees = await axios.get('http://localhost:5000/');
                setEmployees(updatedEmployees.data);
            } catch (error) {
                console.error('Error submitting data:', error);
                alert('Failed to submit employee data.');
            }
        } else {
            console.log('Form submission failed due to validation errors.', newErrors);
        }
    };

    const validateForm = (data: FormData): FormErrors => {
        const errors: FormErrors = {};

        if (!data.employeeName.trim()) {
            errors.employeeName = 'Employee name is required';
        }

        if (!data.employeeId.trim()) {
            errors.employeeId = 'Employee ID is required';
        } else if (data.employeeId.length > 10) {
            errors.employeeId = 'Employee ID cannot exceed 10 characters';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(data.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be 10 digits';
        }

        if (!data.department.trim()) {
            errors.department = 'Department is required';
        }

        if (!data.dateOfJoining) {
            errors.dateOfJoining = 'Date of joining is required';
        } else if (new Date(data.dateOfJoining) > new Date()) {
            errors.dateOfJoining = 'Date of joining cannot be in the future';
        }

        if (!data.role.trim()) {
            errors.role = 'Role is required';
        }

        return errors;
    };

    const handleDelete = async (employeeId: string) => {
        const trimmedEmployeeId = employeeId.trim();
        const encodedEmployeeId = encodeURIComponent(trimmedEmployeeId);

        try {
            console.log(`Attempting to delete employee with ID: ${encodedEmployeeId}`);
            await axios.delete(`http://localhost:5000/api/employees/${encodedEmployeeId}`);
            alert('Employee deleted successfully!');
            setEmployees(employees.filter((employee) => employee.employeeId !== encodedEmployeeId));
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee.');
        }
    };

    const handleEdit = (employee: FormData) => {
        setFormData({
            employeeName: employee.employeeName,
            employeeId: employee.employeeId,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            department: employee.department,
            dateOfJoining: employee.dateOfJoining,
            role: employee.role,
        });
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Employee Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Employee Name:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                    />
                    {errors.employeeName && <span className="error-message">{errors.employeeName}</span>}
                </div>
                <div>
                    <label className="form-label">Employee ID:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                    />
                    {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
                </div>
                <div>
                    <label className="form-label">Email:</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div>
                    <label className="form-label">Phone Number:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>
                <div>
                    <label className="form-label">Department:</label>
                    <select
                        className="form-input"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value="">Select Department</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                    {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
                <div>
                    <label className="form-label">Date of Joining:</label>
                    <input
                        className="form-input"
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                    />
                    {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
                </div>
                <div>
                    <label className="form-label">Role:</label>
                    <input
                        className="form-input"
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    />
                    {errors.role && <span className="error-message">{errors.role}</span>}
                </div>
                <button className="submit-button" type="submit">
                    {employees.find(emp => emp.employeeId === formData.employeeId) ? 'Update' : 'Submit'}
                </button>
                <button
                    className="reset-button"
                    type="button"
                    onClick={() =>
                        setFormData({
                            employeeName: '',
                            employeeId: '',
                            email: '',
                            phoneNumber: '',
                            department: '',
                            dateOfJoining: '',
                            role: '',
                        })
                    }
                >
                    Reset
                </button>
            </form>

            <h3>Employee List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Date of Joining</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.employeeName}</td>
                            <td>{employee.employeeId}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>{employee.department}</td>
                            <td>{employee.dateOfJoining}</td>
                            <td>{employee.role}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(employee)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(employee.employeeId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeForm;
