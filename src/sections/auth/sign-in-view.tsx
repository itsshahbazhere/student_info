import { useState, useCallback } from 'react';
import { useFirebase } from 'src/context/Firebase';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
   const firebase = useFirebase();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@123.com');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await firebase.signinUserWithEmailAndPassword(email, password);
      router.push('/'); 
    } catch (err) {
      alert('Enter a valid email or password');
    } finally{
      setLoading(false);
    }
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        onChange={ (e) => setEmail(e.target.value)}
        value={email}
        name="email"
        label="Email address"
        type='email'
        placeholder='Enter you email'
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        onChange={ (e) => setPassword(e.target.value)}
        value={password}
        name="password"
        label="Password"
        placeholder='Password'
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
