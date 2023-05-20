import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { faCircleArrowRight, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  if (isAuthenticated) {
    if (router.query.from as string) {
      router.push(router.query.from as string);
    } else {
      router.push("/");
    }
    return <></>;
  }

  return (
    <MainLayout navbar={false}>
      <div className="text-center m-10 p-4">
        <h1 className="text-2xl text-slate-200 mb-8">CKPT Innlogging</h1>
        {loginFailed && <p className='text-pink-300 text-lg mb-6'>Feil ved innlogging!</p>}
        <form>
          <FontAwesomeIcon icon={faUser} size='lg' fixedWidth={true} className='text-orange-300 pr-2 -ml-8' />
          <input
            className="mx-auto placeholder-slate-200 placeholder-opacity-30 outline-none focus:border-orange-400 bg-transparent border-2 rounded border-orange-300 text-orange-300 mb-4 appearance-none p-2"
            type="text"
            placeholder="Brukernavn"
            value={username}
            onChange={(e) => {
              e.preventDefault();
              setUsername(e.target.value);
            }}
            autoFocus={true}
          />
          <br />
          <FontAwesomeIcon icon={faLock} size='lg' fixedWidth={true} className='text-orange-300 pr-2 -ml-8' />
          <input
            className="mx-auto placeholder-slate-200 placeholder-opacity-30 outline-none focus:border-orange-400 bg-transparent border-2 rounded border-orange-300 text-orange-300 mb-4 appearance-none p-2"
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => {
              e.preventDefault();
              setPassword(e.target.value);
            }}
          />
          <button
            className="mx-auto block border-orange-300 mt-8 outline-none focus:border-orange-400 border-2 p-2 rounded text-orange-300 hover:text-gray-900 hover:bg-orange-300"
            onClick={async (e) => {
              e.preventDefault();
              setLoginFailed(false);
              if (username.length === 0 || password.length === 0) {
                setLoginFailed(true);
                return;
              }
              setLoginFailed(!!!await login(username, password));
            }}
          >
            Logg inn
            <FontAwesomeIcon icon={faCircleArrowRight} fixedWidth={true} className='pl-1' />
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
