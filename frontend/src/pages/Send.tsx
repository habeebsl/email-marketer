import { ButtonSpinner } from "../components/ButtonSpinner";
import { Notification } from "../components/Notification";
import { apiService } from "../services/api";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function SendPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({ message: '', type: 'success', isVisible: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const projectID = currentPath.split('/')[2]
      const response = await apiService.sendMails(projectID, email)
      console.log(response.data)
      setNotification({
        message: 'Email sent successfully!',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error("Send failed:", error);
      setNotification({
        message: 'Failed to send email. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLoading(false)
      setEmail("")
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      <form className="space-y-6 w-100" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Reply Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="text-[white] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ButtonSpinner />
                  Sending...
                </span>
              ) : (
                "Send"
              )}
          </button>
        </div>
      </form>
    </div>
  );
}