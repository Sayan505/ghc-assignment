import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`http://localhost:3000/api/messages?page=${currPage}`);
        if (!response.ok) {
          throw new Error('network error');
        }
        const data = await response.json();
        setMessages(data.data);
        setCurrPage(data.curr_page);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [currPage]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Messages Page</h1>
      <Link to="/">Go Home</Link>
      <div>
        <h2>Message List:</h2>
        <ul>
          {messages.map((message) => (
            <li key={message._id}>
              <p>Customer ID: {message.customer_id}</p>
              <p>Customer Email: {message.customer_email}</p>
              <p>Checkout Created At: {new Date(message.checkout_created_at).toLocaleString()}</p>
              <p>Notification Timestamp: {new Date(message.notification_timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <div>
          <button 
            disabled={currPage <= 1} 
            onClick={() => setCurrPage(currPage - 1)}
          >
            Previous
          </button>
          <span> Page {currPage} of {totalPages} </span>
          <button 
            disabled={currPage >= totalPages} 
            onClick={() => setCurrPage(currPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


export default MessagesPage;
