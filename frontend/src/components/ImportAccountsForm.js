import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ImportAccountsForm = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/api/accounts/import_accounts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Import successful:", response.data);
        onImportSuccess(); // Trigger refresh of account list
      })
      .catch((error) => {
        console.error("Error importing accounts:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Import Accounts CSV</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Import
      </Button>
    </Form>
  );
};

export default ImportAccountsForm;
