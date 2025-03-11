import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Container, Form, Button, Card } from "react-bootstrap";

const CustomerProfile = () => {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        country: "",
        state: "",
        profilePic: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const id = localStorage.getItem('userId') || "1";


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get(`http://localhost:2000/api/users/profile/${id}`);
                setCustomer(data);
            } catch (err) { 
                setError("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", customer.name);
            formData.append("email", customer.email);
            formData.append("country", customer.country);
            formData.append("state", customer.state);
            if (selectedFile) formData.append("profilePic", selectedFile);

            await API.put("/user/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <h3>Customer Profile</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={customer.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                name="country"
                                value={customer.country}
                                onChange={handleChange}
                            >
                                <option value="">Select Country</option>
                                <option value="USA">USA</option>
                                <option value="India">India</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button type="submit" className="mt-3">
                            Update Profile
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CustomerProfile;
