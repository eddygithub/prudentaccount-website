// LoginPage.jsx
export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br rounded-2xl from-slate-50 to-slate-200 antialiased flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-2xl bg-slate-900/90 text-white font-semibold">
            Prudent
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Meets your Insurance needs!</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); /* handleLogin() */ }}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-300">Forgot?</a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-700">Remember me</label>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:bg-indigo-700"
            >
              Sign in
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs uppercase tracking-wide text-slate-500">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Google
            </button>
            <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Create one</a>
        </p>
      </div>
    </main>
  );
}
