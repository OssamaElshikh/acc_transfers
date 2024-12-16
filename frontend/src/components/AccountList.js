import React from "react";
import Table from "react-bootstrap/Table";

const AccountList = ({ accounts }) => {
  return (
    <div>
      <h2>Accounts</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.name}</td>
              <td>
                $
                {isNaN(account.balance)
                  ? "N/A"
                  : parseFloat(account.balance).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccountList;
