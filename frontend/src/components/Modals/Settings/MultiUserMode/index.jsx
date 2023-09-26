import React, { useState } from "react";
import System from "../../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../../utils/constants";
import paths from "../../../../utils/paths";

const noop = () => false;
export default function MultiUserMode({ hideModal = noop }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [useMultiUserMode, setUseMultiUserMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const form = new FormData(e.target);
    const data = {
      username: form.get("username"),
      password: form.get("password"),
    };

    const { success, error } = await System.setupMultiUser(data);
    if (success) {
      setSuccess(true);
      setSaving(false);
      setTimeout(() => {
        window.localStorage.removeItem(AUTH_USER);
        window.localStorage.removeItem(AUTH_TOKEN);
        window.location = paths.admin.users();
      }, 2_000);
      return;
    }

    setError(error);
    setSaving(false);
  };

  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
          ClassCat&reg; KBase インスタンスを更新して、自身のワークスペースを持つ複数の同時接続可能なユーザをサポートすることができます。
          管理者として、すべてのワークスペースを見てユーザをワークスペースに追加することができます。
          この変更は不可逆で ClassCat&reg; KBase インスタンスのインストールを永続的に変更します。
          </p>
        </div>
        {(error || success) && (
          <div className="w-full flex px-6">
            {error && (
              <div className="w-full bg-red-300 text-red-800 font-semibold px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="w-full bg-green-300 text-green-800 font-semibold px-4 py-2 rounded-lg">
                ページは数秒で更新されます。
              </div>
            )}
          </div>
        )}
        <div className="p-6 space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <form onSubmit={handleSubmit}>
              <div className="">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  マルチユーザ・モードを有効にする
                </label>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    onClick={() => setUseMultiUserMode(!useMultiUserMode)}
                    checked={useMultiUserMode}
                    className="peer sr-only pointer-events-none"
                  />
                  <div className="pointer-events-none peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-stone-400 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
              <div className="w-full flex flex-col gap-y-2 my-2">
                {useMultiUserMode && (
                  <>
                    <p className="text-gray-800 dark:text-stone-200 text-sm bg-gray-200 dark:bg-stone-800 rounded-lg p-4">
                    デフォルトでは、貴方が唯一の管理者になります。
                    管理者としてすべての新しいユーザや管理者のアカウントを作成する必要があります。
                    管理者ユーザだけがパスワードをリセットできますので、パスワードを失わないように注意してください。
                    </p>
                    <div>
                      <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        管理者アカウント・ユーザ名
                      </label>
                      <input
                        name="username"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="管理者ユーザ名"
                        minLength={2}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        管理者アカウント・パスワード
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="管理者パスワード"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      disabled={saving}
                      type="submit"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      {saving ? "有効にしています..." : "マルチユーザ・モードを有効にする"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
