// App.jsx

import { useEffect, useState } from "react";

function App() {
  const API_URL = "https://node-day-2-p01p.onrender.com/employees";

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  // Fetch Employees
  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Employee
  const addEmployee = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // Edit Employee
  const editEmployee = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // Update Employee
  const updateEmployee = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setEditingId(null);

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    getEmployees();
  };

  // Search + Filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {/* Employee Count */}
      <h3>Total Employees: {filteredEmployees.length}</h3>

      {/* Search Employee */}
      <input
        type="text"
        placeholder="Search Employee"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter by Department */}
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="All">All Departments</option>
        <option value="HR">HR</option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
      </select>

      {/* Form */}
      <form
        onSubmit={editingId ? updateEmployee : addEmployee}
        className="form"
      >
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee Cards */}
      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div key={employee.id} className="card">
              <h3>{employee.name}</h3>

              <p>
                <strong>Department:</strong> {employee.department}
              </p>

              <p>
                <strong>Salary:</strong> ₹{employee.salary}
              </p>

              <button onClick={() => editEmployee(employee)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteEmployee(employee.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <h3>No Employees Found</h3>
        )}
      </div>
    </div>
  );
}

export default App;