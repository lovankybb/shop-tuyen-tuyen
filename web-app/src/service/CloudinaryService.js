const BASE  = 'https://api.cloudinary.com/v1_1/dh7l8j5s9/image/upload';

export const CloudinaryService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        try {
            const response = await fetch(BASE, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};