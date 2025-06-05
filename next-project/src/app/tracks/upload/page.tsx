'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [folderPath, setFolderPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/upload/file/${file.name}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setSuccess('File uploaded successfully!');
            router.push('/tracks');
        } catch (error: any) {
            setError(error?.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const handleFolderUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderPath) {
            setError('Please enter a folder path');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/upload/folder/${encodeURIComponent(folderPath)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setSuccess('Folder uploaded successfully!');
            router.push('/tracks');
        } catch (error: any) {
            setError(error?.message || 'Failed to upload folder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upload Tracks</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upload Single File</h2>
                    <form onSubmit={handleFileUpload}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Select FLAC File
                            </label>
                            <input
                                type="file"
                                accept=".flac"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </form>
                </div>

                {/* Folder Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upload Folder</h2>
                    <form onSubmit={handleFolderUpload}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Folder Path
                            </label>
                            <input
                                type="text"
                                value={folderPath}
                                onChange={(e) => setFolderPath(e.target.value)}
                                placeholder="Enter folder path"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !folderPath}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Upload Folder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 