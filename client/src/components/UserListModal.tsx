import { useProjectContext } from '@/providers/projectProvider';
import Text from './Text';
import { useMemo, useState } from 'react';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import AlertController from '@/controllers/AlertController';
import { useUserContext } from '@/providers/userProvider';

export default function UserListModal(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const { user } = useUserContext();
  const { users, addUser, removeUser, project } = useProjectContext();

  const userArray = useMemo(() => Array.from(users.values()), [users]);

  const handleAddUser = async () => {
    if (!REGEX.email.test(email))
      return ToastController.showErrorToast({
        title: 'Invalid email',
        description: 'Please make sure to add a valid email',
      });

    setIsLoading(true);
    await addUser(email);
    setIsLoading(false);
    setEmail('');
  };
  const handleRemoveUser = async (userId: string) => {
    AlertController.show({ callback: async () => await removeUser(userId) });
  };

  return (
    <div
      className={
        'bg-white grow shadow-md shadow-black/5 md:max-w-screen-md flex max-w-[70%] border border-black/5 flex-col text-start px-3 py-4 rounded-xl space-y-2 m-auto'
      }
    >
      <div className="flex justify-between">
        <Text.Headline className="text-black font-medium text-[15px]">
          Current users
        </Text.Headline>
      </div>

      <div className="space-y-3 pt-2 max-h-80 overflow-y-auto">
        {userArray.map(({ id, email, name }) => {
          const isAdmin = project?.adminId === id;
          const isSelf = user?.id === id;
          const removeVisible = !isAdmin && !isSelf;
          return (
            <div
              key={id}
              className="flex justify-between px-2"
            >
              <div className="space-y-1">
                <div className="flex space-x-2">
                  <Text.Body>{isSelf ? 'You' : name}</Text.Body>
                  {isAdmin && (
                    <div className="bg-primary rounded-md p-1">
                      <Text.Subtitle className="text-white text-[10px]">
                        Admin
                      </Text.Subtitle>
                    </div>
                  )}
                </div>
                <Text.Subtitle className="text-black/60">{email}</Text.Subtitle>
              </div>
              {removeVisible && (
                <button
                  onClick={() => handleRemoveUser(id)}
                  className="btn btn-error"
                >
                  <Text.Subtitle className="text-white">Remove</Text.Subtitle>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {user?.id === project?.adminId && (
        <>
          <div className="divider" />

          <div className="flex space-x-3">
            <input
              disabled={isLoading}
              onInput={({ currentTarget: { value } }) => setEmail(value)}
              value={email}
              type="text"
              className="input text-sm bg-white text-black input-bordered w-full"
              placeholder="fabian.simon98@gmail.com"
            />
            <button
              onClick={handleAddUser}
              className="btn btn-primary max-h-12"
            >
              {isLoading ? (
                <span className="loading text-white"></span>
              ) : (
                <Text.Subtitle className="text-white">
                  Add new user
                </Text.Subtitle>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
