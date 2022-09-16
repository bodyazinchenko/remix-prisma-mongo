
import { Form, Link, useActionData } from "@remix-run/react";
import { Layout } from '~/components/Layout'
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from '@remix-run/node';
import { validateEmail, validateName, validatePassword } from '~/utils/validators.server'
import { register, getUser } from "~/utils/auth.server";

type ActionData = {
  error?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;
  let firstName = form.get('firstName') as string;
  let lastName = form.get('firstName') as string;

  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    return json({ error: `Invalid Form Data` }, { status: 400 })
  }

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateName(firstName || ''),
    lastName: validateName(lastName || ''),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return json(
      {
        fieldErrors,
        fields: { email, password, firstName, lastName }
      },
      { status: 400 }
    )
  }

  return await register({ email, password, firstName, lastName })
}

export default function Signup() {
  const actionData = useActionData<ActionData>();
  console.log('actionData', actionData);
  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
      <Link to="/login" className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
        Login
      </Link>
        <h2 className="text-5xl font-extrabold text-yellow-300">Welcome to Kudos!</h2>
        <p className="font-semibold text-slate-300">Sign Up To Give Some Praise!</p>

        <Form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          {actionData?.error && (
            <p
              className="font-semibold text-red-500"
              role="alert"
            >
              {actionData.error}
            </p>
          )}
          <label htmlFor="email" className="text-blue-600 font-semibold">
            Email
          </label>
          <input 
            type="text" 
            id="email" 
            name="email" 
            className="w-full p-2 rounded-xl my-2"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-errormessage={actionData?.fieldErrors?.email}
          />
          {actionData?.fieldErrors?.email && (
            <p className="text-red-500">{actionData.fieldErrors.email}</p>
          )}

          <label htmlFor="password" className="text-blue-600 font-semibold">
            Password
          </label>
          <input
            type="password" 
            id="password"
            name="password"
            className="w-full p-2 rounded-xl my-2" 
            defaultValue={actionData?.fields?.password}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={actionData?.fieldErrors?.password}
          />
          {actionData?.fieldErrors?.password && (
            <p className="text-red-500">{actionData.fieldErrors.password}</p>
          )}

          <label htmlFor="firstName" className="text-blue-600 font-semibold">
            First Name
          </label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            className="w-full p-2 rounded-xl my-2" 
            defaultValue={actionData?.fields?.firstName}
            aria-invalid={Boolean(actionData?.fieldErrors?.firstName)}
            aria-errormessage={actionData?.fieldErrors?.firstName}
          />
          {actionData?.fieldErrors?.firstName && (
            <p className="text-red-500">{actionData.fieldErrors.firstName}</p>
          )}

          <label htmlFor="lastName" className="text-blue-600 font-semibold">
            Last Name
          </label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            className="w-full p-2 rounded-xl my-2" 
            defaultValue={actionData?.fields?.lastName}
            aria-invalid={Boolean(actionData?.fieldErrors?.lastName)}
            aria-errormessage={actionData?.fieldErrors?.lastName}
          />
          {actionData?.fieldErrors?.lastName && (
            <p className="text-red-500">{actionData.fieldErrors.lastName}</p>
          )}

          <div className="w-full text-center">
            <input
              type="submit"
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value="Sign Up"
            />
          </div>
        </Form>
      </div>
    </Layout>
  )
}