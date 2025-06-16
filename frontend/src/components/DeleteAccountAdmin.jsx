import { deleteUserAdmin } from "../utils/authAPIHandler";
import { useOverlayContext } from "../contexts/OverlayContext";

export default function DeleteAccountAdmin({ userId, username, index, onDelete}) {
    const { closeOverlay } = useOverlayContext();

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await deleteUserAdmin(userId);
            onDelete(index);
            closeOverlay();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert("Error deleting account, please try again");
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-4xl text-center">Delete Account</h1>
            <p className="text-red-500 text-center">Are you sure you want to delete {username}'s account? This action is permanent and can't be undone.</p>
            <div className="flex flex-row mt-2">
                <button className="w-full p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg" onClick={handleDelete}>Delete</button>
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-1" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}