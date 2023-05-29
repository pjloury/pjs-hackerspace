// Import useState for managing the text state
import { useState, useEffect } from 'react';
// Import firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../main.css';
import DeleteIcon from '@material-ui/icons/Delete'; // Import Trash icon


/*
export default function SaveText() {
  // State for managing the text
  const [text, setText] = useState('');

  // Function to handle save button click
  const handleSave = async () => {
    if (text) {
      const db = firebase.firestore();
      await db.collection('entries').add({
        text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setText('');  // Clear the text box
      console.log('Text saved!');
    } else {
      console.log('Text box is empty!');
    }
  };

  return (
    <div className="container">
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter some text"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
*/

export default function SaveText() {
  // State for managing the text
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);

  const db = firebase.firestore();

  useEffect(() => {
    db.collection('entries').onSnapshot((snapshot) => {
      const newEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(newEntries);
      setEntries(newEntries);
    });
  }, [db]);

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

  const deleteEntry = async (id) => {
    await db.collection('entries').doc(id).delete();
  };

  return (
    <div className="container">
      <h1> PJ's Journal</h1>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows="4" placeholder="Tell me what's happening"/>
      <button class="button" onClick={handleSave}>Save</button>
      <table>
      <tbody>
        {entries.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds).map((entry) => (
            <tr key={entry.id}>
              <td>{entry.timestamp.toDate().toLocaleString()}</td>
              <td>{entry.text}</td>
              <td>
                <button className="delete-button" onClick={() => deleteEntry(entry.id)}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
