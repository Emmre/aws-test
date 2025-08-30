"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./auth/AuthContext";

export default function Home() {
  const { token, hydrated } = useAuth();
  if (!hydrated) return <div>Loading...</div>;
  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1
          className="text-3xl font-bold mb-4 text-center sm:text-left"
          style={{ color: "var(--primary)" }}
        >
          TodoPro'ya Hoş Geldiniz!
        </h1>
        <p className="text-lg text-center sm:text-left max-w-xl mb-4">
          Kendi yapılacaklar listenizi oluşturun, yönetin ve görevlerinize görsel
          ekleyin. Başlamak için giriş yapın veya kayıt olun.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!token && (
            <>
              <Link
                href="/auth/login"
                className="btn btn-primary w-full sm:w-auto"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Kayıt Ol
              </Link>
            </>
          )}
          <Link
            href="/todos"
            className="btn w-full sm:w-auto"
            style={{ background: "var(--primary-dark)", color: "white" }}
          >
            Todo Listem
          </Link>
        </div>
      </main>
    </div>
  );
}
