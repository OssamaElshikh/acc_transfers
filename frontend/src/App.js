import React, { useState, useEffect } from "react";
import axios from "axios";
import AccountList from "./components/AccountList";
import TransferForm from "./components/TransferForm";
import ImportAccountsForm from "./components/ImportAccountsForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./App.css"; // Import custom CSS

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAccounts = () => {
    axios
      .get("/api/accounts/")
      .then((response) => setAccounts(response.data))
      .catch((error) => console.error("Error fetching accounts:", error));
  };

  const deleteAllAccounts = () => {
    axios
      .delete("/api/accounts/delete_all_accounts/")
      .then((response) => {
        console.log("All accounts deleted");
        setAccounts([]);
      })
      .catch((error) => console.error("Error deleting accounts:", error));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <h1 className="my-4 text-center">Account Transfer App</h1>
      <Row className="mb-4">
        <Col>
          <ImportAccountsForm onImportSuccess={fetchAccounts} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <TransferForm onTransferSuccess={fetchAccounts} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => setShowTable(false)}>
            Hide Info
          </Button>{" "}
          <Button variant="secondary" onClick={() => setShowTable(true)}>
            Show Info
          </Button>{" "}
          <Button variant="danger" onClick={deleteAllAccounts}>
            Delete Data
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      {showTable && (
        <Row>
          <Col>
            <AccountList accounts={filteredAccounts} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
