'use client';

import { useEffect, useState } from 'react';
import { Row, Col, message, Spin } from 'antd';
import { TrackCard } from '@/components/tracks/TrackCard';
import { AudioPlayer } from '@/components/tracks/AudioPlayer';
import { getTracks } from '@/lib/api/track';
import type { Track } from '@/types/track';

export default function TracksPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const data = await getTracks();
            console.log('Received tracks data:', data);
            console.log('Data type:', typeof data);
            console.log('Is Array?', Array.isArray(data));
            if (!Array.isArray(data)) {
                throw new Error('Expected tracks data to be an array');
            }
            setTracks(data);
        } catch (error: any) {
            console.error('Error in fetchTracks:', error);
            message.error(error.message || 'Failed to fetch tracks');
            setTracks([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (track: Track) => {
        setCurrentTrack(track);
    };

    const handleNext = () => {
        if (currentTrack) {
            const currentIndex = tracks.findIndex((t) => t._id === currentTrack._id);
            const nextTrack = tracks[currentIndex + 1];
            if (nextTrack) {
                setCurrentTrack(nextTrack);
            }
        }
    };

    const handlePrevious = () => {
        if (currentTrack) {
            const currentIndex = tracks.findIndex((t) => t._id === currentTrack._id);
            const previousTrack = tracks[currentIndex - 1];
            if (previousTrack) {
                setCurrentTrack(previousTrack);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {tracks.length === 0 ? (
                <div className="text-center py-8">
                    <p>No tracks found</p>
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {tracks.map((track) => (
                        <Col key={track._id} xs={24} sm={12} md={8} lg={6}>
                            <TrackCard track={track} onPlay={handlePlay} />
                        </Col>
                    ))}
                </Row>
            )}
            {currentTrack && (
                <AudioPlayer
                    track={currentTrack}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            )}
        </div>
    );
} 