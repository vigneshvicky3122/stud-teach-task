import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { url } from "../App";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function Dashboard() {
  let navigate = useNavigate();

  const [Mentor, setMentor] = useState([]);

  const [Unassigned, setUnassigned] = useState([]);
  const [MentorIndex, setMentorIndex] = useState("");

  useEffect(() => {
    user();
  }, []);
  let user = async () => {
    try {
      let send = await axios.get(`${url}/user`);

      if (send.data.status === 200) {
        setMentor(send.data.Mentor);
        setUnassigned(send.data.Unassigned);
      }
      if (send.data.status === 400) {
        window.confirm(send.data.message);
      }
      if (send.data.statusCode > 400) {
        window.alert(send.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  let handleSubmit = async (data, index) => {
    let update = [...Mentor];
    update[MentorIndex].Students.push(data);
    setMentor(update);
    let updateUnassigned = [...Unassigned];
    updateUnassigned.splice(index, 1);
    setUnassigned(updateUnassigned);
    try {
      if (MentorIndex === "") {
        window.alert("Please select a mentor");
      } else {
        let request = await axios.put(
          `${`${url}/assigned`}/${Mentor[MentorIndex].name}`,
          data,
          {
            headers: {
              authorization: window.localStorage.getItem("app-token"),
            },
          }
        );
        if (request.data.status === 200) {
          navigate("/dashboard");
        }
        if (request.data.status === 400) {
          window.alert(request.data.message);
          navigate("/login");
        }
        if (request.data.status === 401) {
          window.alert(request.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  let handleRemove = async (data, index) => {
    let update = [...Mentor];
    update[MentorIndex].Students.splice(index, 1);
    setMentor(update);
    let updateUnassigned = [...Unassigned];
    updateUnassigned.push(data);
    setUnassigned(updateUnassigned);
    try {
      if (MentorIndex === "") {
        window.alert("Please select a mentor");
      } else {
        let request = await axios.put(
          `${`${url}/Unassigned`}/${Mentor[MentorIndex].name}`,
          data,
          {
            headers: {
              authorization: window.localStorage.getItem("app-token"),
            },
          }
        );
        if (request.data.status === 200) {
          navigate("/dashboard");
        }
        if (request.data.status === 404) {
          window.alert(request.data.message);
          navigate("/login");
        }
        if (request.data.status === 401) {
          window.alert(request.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navigation />
      <div className="select-container">
        <select
          onChange={(e) => setMentorIndex(e.target.value)}
          value={MentorIndex}
        >
          <option selected="selected" label="Select Mentor" />
          {Mentor &&
            Mentor.map((e, i) => {
              return (
                <option value={i} key={i}>
                  {e.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mentor Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Unassigned &&
              Unassigned.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.mentor}</td>
                    <td>{e.role}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          MentorIndex === "" || undefined
                            ? window.alert("Please select anyone Mentor")
                            : handleSubmit(
                                {
                                  _id: e._id,
                                  name: e.name,
                                  email: e.email,
                                  mobile: e.mobile,
                                  mentor: Mentor[MentorIndex].name,
                                  role: e.role,
                                },
                                i
                              );
                        }}
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      {MentorIndex === "" || undefined ? null : (
        <div className="container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mentor Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Mentor &&
                Mentor[MentorIndex].Students.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.mentor}</td>
                      <td>{e.role}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleRemove(
                              {
                                _id: e._id,
                                name: e.name,
                                email: e.email,
                                mobile: e.mobile,
                                mentor: "",
                                role: e.role,
                              },
                              i
                            )
                          }
                        >
                          UnAssign
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default Dashboard;
