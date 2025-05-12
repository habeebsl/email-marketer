import { ButtonSpinner } from "./ButtonSpinner";
import { Notification } from "./Notification";
import { useState } from "react";
import { useData } from "../store/useDataStore";

export function DataForm() {
  const { formData, setFormData, setCurrentStep } = useData()
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
      setNotification({
        message: 'Data saved successfully!',
        type: 'success',
        isVisible: true
      });
      setCurrentStep(1)
    } catch (error) {
      console.error("Submission failed:", error);
      setNotification({
        message: 'Failed to save data. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(
      name === 'painPoint' ? value : formData.pain_point,
      name === 'offer' ? value : formData.offer_summary,
      name === 'cta' ? value : formData.cta_line,
    );
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
            htmlFor="painPoint"
            className="block text-sm font-medium text-gray-300"
          >
            Pain Point
          </label>
          <div className="mt-1">
            <textarea
              id="painPoint"
              name="painPoint"
              required
              rows={4}
              className="text-[white] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.pain_point}
              onChange={handleChange}
              placeholder="Describe the customer's pain point"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="offer"
            className="block text-sm font-medium text-gray-300"
          >
            Offer
          </label>
          <div className="mt-1">
            <textarea
              id="offer"
              name="offer"
              required
              rows={4}
              className="text-[white] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.offer_summary}
              onChange={handleChange}
              placeholder="Describe your offer/solution"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="CTA"
            className="block text-sm font-medium text-gray-300"
          >
            CTA
          </label>
          <div className="mt-1">
            <textarea
              id="cta"
              name="cta"
              required
              rows={4}
              className="text-[white] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.cta_line}
              onChange={handleChange}
              placeholder="E.g, Would you be open to a 15-minute call this week?"
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
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}