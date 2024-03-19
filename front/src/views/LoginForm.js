import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { UserContext } from '../store/UserContext';
import { login } from '../http';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid Email!')
    .required('Required'),
  password: Yup.string().required('Required')
});


export default function RegisterForm(){
  const initialValues = { email: '', password: '' };
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values);
      userCtx.authenticateUser({ id: result.data.id, token: result.data.token });
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '5%', backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: '#1976d2' }}>
        Login
      </Typography>
      <Formik
        initialValues={initialValues }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values, errors, touched }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field
                as={TextField}
                label="Email"
                name="email"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 1 }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                sx={{ mb: 2 }}
                onClick={() => navigate('/register', { replace: true })}
              >
                Go To Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  ); 
}