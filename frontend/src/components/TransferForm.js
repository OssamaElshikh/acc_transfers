import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const TransferForm = ({ onTransferSuccess }) => {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure input trimming to avoid spaces
    const cleanedFromAccountId = fromAccountId.trim();
    const cleanedToAccountId = toAccountId.trim();

    if (!cleanedFromAccountId || !cleanedToAccountId || !amount) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    const data = {
      to_account_id: cleanedToAccountId,
      amount: parseFloat(amount), // Ensure amount is sent as a number
    };

    axios
      .post(`/api/accounts/${cleanedFromAccountId}/transfer/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMessage("Transfer successful!");
        setMessageType("success");
        onTransferSuccess(); // Trigger account list refresh
        setFromAccountId("");
        setToAccountId("");
        setAmount("");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error during transfer please check IDs";
        setMessage(errorMessage);
        setMessageType("error");
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFromAccountId">
          <Form.Label>From Account ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter from account ID"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formToAccountId">
          <Form.Label>To Account ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter to account ID"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Transfer
      </Button>

      {message && (
        <div
          className={`mt-3 alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
    </Form>
  );
};

export default TransferForm;
