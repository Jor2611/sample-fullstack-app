import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register } from '../http';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid Email!')
    .required('Required'),
  password: Yup.string().required('Required'),
  role: Yup.string().required('Role is required'),
});

const roles = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export default function RegisterForm() {
  const initialValues = { email: '', password: '', role: 'user' };
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await register(values);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '5%', backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: '#1976d2' }}>
        Register
      </Typography>
      <Formik
        initialValues={initialValues}
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
              <Field
                as={TextField}
                select
                label="Role"
                name="role"
                value={values.role}
                onChange={handleChange}
                error={touched.role && Boolean(errors.role)}
                helperText={touched.role && errors.role}
                fullWidth
                margin="normal"
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 1 }}
              >
                Register
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                sx={{ mb: 2 }}
                onClick={() => navigate('/login', { replace: true })}
              >
                Go To Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
