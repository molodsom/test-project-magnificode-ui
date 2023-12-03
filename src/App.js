import * as React from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import {
    Avatar,
    Box, Button, Card, CardContent,
    Container,
    createTheme,
    CssBaseline,
    TextField,
    ThemeProvider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOutlinedIcon from '@mui/icons-material/FormatQuoteSharp';
import {useEffect, useState} from "react";

const defaultTheme = createTheme();
const baseUrl = 'http://localhost:8000';

function App() {
    const [quotes, setQuotes] = useState([]);
    const [record, setRecord] = useState(0);
    const [formData, setFormData] = useState({
        text: '',
        author_name: '',
    });
    const updateRecords = () => {
        axios.get(baseUrl + '/api/quotes/')
            .then(response => setQuotes(response.data))
            .catch(error => console.error('Error fetching quotes:', error));
    }
    const updateForm = (quote) => {
        setRecord(quote.id);
        setFormData({text: quote.text, author_name: quote.author_name});
    }

    const deleteQuote = (quote) => {
        axios.delete(baseUrl + '/api/quotes/' + quote.id + '/').then(() => updateRecords());
        setRecord(0);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => { updateRecords(); }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!!record) {
            axios.put(baseUrl + '/api/quotes/' + record + '/', {
                text: data.get('text'), author_name: data.get('author_name')})
                .then(() => updateRecords())
        } else {
            axios.post(baseUrl + '/api/quotes/', {
                text: data.get('text'), author_name: data.get('author_name')})
                .then(() => updateRecords())
        }
    };
  return (<ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
              }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                  {!record && <>New Quote</>}
                  {!!record && <>Edit Quote #{record}</>}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="text"
                      label="Text"
                      name="text"
                      value={formData.text}
                      onChange={handleInputChange}
                      rows="2"
                      multiline
                      autoFocus
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleInputChange}
                      label="Author"
                      id="author_name"
                  />
                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                  >
                      Save
                  </Button>
              </Box>
          </Box>
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
          }}>
              {quotes.map(quote => (
              <Card variant="outlined" sx={{marginTop: 2, width: "100%"}}>
                  <CardContent>
                      <Typography variant="h6" component="div">
                          “{quote.text}“
                      </Typography>
                      <Typography sx={{ fontSize: 14, textAlign: "right" }}>
                          {quote.author_name}
                      </Typography>
                      <Button variant="outlined" onClick={() => updateForm(quote)} startIcon={<EditIcon />}>Edit</Button>
                      <Button variant="outlined" onClick={() => deleteQuote(quote)} startIcon={<DeleteIcon />}>Delete</Button>
                  </CardContent>
              </Card>
              ))}
          </Box>
      </Container>
  </ThemeProvider>);
}

export default App;