'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import {
  Alert,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { login } from '../../app/actions/auth';
import classes from './LoginForm.module.css';

export function LoginForm({ password }: { password: string }) {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <main className={classes.page}>
      <Container size={420} className={classes.container}>
        <Image
          src="/fixitcrm-logo.png"
          alt="FixitCRM"
          width={360}
          height={240}
          priority
          className={classes.logo}
        />
        <Title order={1} className={classes.title}>
          Welcome to FixitCRM
        </Title>
        <Text className={classes.subtitle}>
          Manage repair jobs, customers, and appointments in one place.
        </Text>

        <Paper
          component="form"
          action={formAction}
          withBorder
          shadow="sm"
          p="xl"
          mt="xl"
          radius="md"
          className={classes.form}
        >
          {state?.error && (
            <Alert color="red" mb="md" role="alert">
              {state.error}
            </Alert>
          )}
          <TextInput label="Username" value="guest" disabled autoComplete="username" />
          <PasswordInput
            label="Password"
            defaultValue="••••••••"
            disabled
            autoComplete="current-password"
            mt="md"
          />
          <input type="hidden" name="username" value="guest" />
          <input type="hidden" name="password" value={password} />
          <Button type="submit" fullWidth mt="xl" loading={isPending}>
            Explore Demo
          </Button>
        </Paper>
        <Text size="xs" className={classes.footer}>
          FixitCRM · Repair shop management
        </Text>
      </Container>
    </main>
  );
}
