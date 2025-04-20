- Always use Shadcn and Tailwind to design UI for the app.
- For text and headings on UI, always use Vietnamese.
- For form, use React-hook-form and Zod to validate.
- For data fetching, using Vercel's SWR library, the key string will use the constant alias from the endpoints.ts file, the fetcher function will use the axiosFetcher function from the utils.ts file. An example of how to use it is as follows:
  `const { data,  error,  isLoading } =  useSWR(Endpoints.Auth.Login, axiosFetcher)`