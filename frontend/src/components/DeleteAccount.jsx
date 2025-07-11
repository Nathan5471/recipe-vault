import { useOverlayContext } from '../contexts/OverlayContext';
import { deleteUser } from '../utils/authAPIHandler';

export default function DeleteAccount() {
    const { closeOverlay } = useOverlayContext();

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await deleteUser();
            closeOverlay();
            window.location.href = '/register'
        } catch (error) {
            console.error('Error deleting account:', error)
            alert("Error delete account, please try again")
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-4xl text-center">Delete Account</h1>
            <p className="text-red-500 text-center">Deleting your account is permanent, are you sure you want to continue?</p>
            <div className="flex flex-row mt-2">
                <button className="w-full p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg" onClick={handleDelete}>Delete</button>
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-1" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}