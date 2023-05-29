// Import useState for managing the text state
import { useState, useEffect } from 'react';
// Import firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../main.css';
import { TableRow, TableCell, TableBody } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete'; // Import Trash icon

export default function SaveText() {
  // State for managing the text
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const useStyles = makeStyles({
    selected: {
      backgroundColor: "lightblue", // color of your choice for selected rows
    },
  });

  const StyledTableCell = withStyles((theme) => ({
    root: {
      border: 'none',
      boxShadow: 'inner',
    },
  }))(TableCell);

  const db = firebase.firestore();
  const classes = useStyles();

  useEffect(() => {
    console.log("selectedRow changed:", selectedRow);
    db.collection('entries').onSnapshot((snapshot) => {
      const newEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(newEntries);
      setEntries(newEntries);
    });
    document.addEventListener("keydown", handleEscapePress, false);
    // Add event listener for the Delete keypress
    document.addEventListener("keydown", handleDeletePress, false);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscapePress, false);
      document.removeEventListener("keydown", handleDeletePress, false);
    };
  }, [db, selectedRow]);

  // Function to handle save button click
  const handleSave = async () => {
    if (text) {
      await db.collection('entries').add({
        text,
        timestamp: new Date()
      });
      setText('');  // Clear the text box
      console.log('Text saved!');
    } else {
      console.log('Text box is empty!');
    }
  };

  const handleKeyDown = (e) => {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 13) {
      handleSave(e);
    }
  };

  const handleDeletePress = (e) => {
    // Check if the Delete key was pressed
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Check if a row is selected
      if (selectedRow) {
        // Delete the selected row
        handleDelete(selectedRow);

        // Deselect the row
        setSelectedRow(null);
      }
    }
  };

  const handleDelete = async (id) => {
    await db.collection('entries').doc(id).delete();
  };

  const handleRowClick = (id) => {
    console.log("handleRowClick called with id:", id);
    setSelectedRow(id);
  };

  const handleEscapePress = (e) => {
    if (e.key === 'Escape') {
      setSelectedRow(null);
    }
  };

  return (
    <div className="container">
      <h1> PJ's Journal</h1>
      <form onSubmit={handleSave}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="4"
          placeholder="Tell me what's happening" />
        <button type="submit" class="button">Save</button>
      </form>

      <TableBody>
        {entries.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds).map((entry) => {
          return (
            <TableRow
              className={selectedRow === entry.id ? classes.selected : ''}
              //classes={{ root: selectedRow === entry.id ? classes.selected : '' }}
              key={entry.id}
              onClick={() => handleRowClick(entry.id)}
            >
              <StyledTableCell>
                {entry.timestamp &&
                  new Date(entry.timestamp.toDate()).toLocaleString()}
              </StyledTableCell>
              <StyledTableCell>{entry.text}</StyledTableCell>
              <StyledTableCell>
                <button
                  className="delete-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(entry.id);
                  }}
                >
                  <DeleteIcon />
                </button>
              </StyledTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </div>
  );
}
