import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'


function App() {
  const [content, setcontent] = useState('')
  const [tone, setTone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')

  const handleSubmit = async (req, res) => {
    setLoading(true)
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        content,
        tone
      })
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }
    catch (error) {
      setError('Failed to generate email reply. Please try again!')
      console.error(error);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant='h3' component="h1" gutterBottom>
          Email Reply Generator
        </Typography>
        <Box component="section" sx={{ mx: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email Content"
            value={content || ''}
            onChange={(e) => setcontent(e.target.value)}
            sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Tone (optional)</InputLabel>
            <Select
              value={tone || 'Professional'}
              label={"Tone (optional)"}
              onChange={(e) => setTone(e.target.value)}>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>

            </Select>
          </FormControl>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!content || loading}
            fullWidth>
            {loading ? <CircularProgress size={24} /> : "Generate Reply"}
          </Button>
        </Box>

        {error && (
          <Typography color='error' sx={{ mb: 4 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 3,mb:4 }}>
            <Typography variant='h6' gutterBottom>
              Generated Reply
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              inputProps={{ readOnly: true }} />

            <Button
              variant='outlined'
              sx={{ mt: 2 }}
              onClick={(e) => navigator.clipboard.writeText(generatedReply)}>
              Copy to clipboard
            </Button>
          </Box>
        )}
      </Container>
    </>
  )
}

export default App
