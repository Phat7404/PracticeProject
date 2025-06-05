'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Slider, Space, Typography } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Track } from '@/types/track';
import { formatDuration } from '@/lib/utils/format';

const { Text } = Typography;

interface AudioPlayerProps {
  track: Track;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const AudioPlayer = ({ track, onNext, onPrevious }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `${process.env.NEXT_PUBLIC_API_URL}/tracks/stream/${track._id}`;
      setDuration(audioRef.current.duration);
    }
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSliderChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      />
      <div className="max-w-4xl mx-auto">
        <Space direction="vertical" size={8} className="w-full">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<StepBackwardOutlined />}
              onClick={onPrevious}
              disabled={!onPrevious}
            />
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              className="text-2xl"
            />
            <Button
              type="text"
              icon={<StepForwardOutlined />}
              onClick={onNext}
              disabled={!onNext}
            />
            <div className="flex-1">
              <Text strong>{track.title}</Text>
            </div>
            <Text type="secondary">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </Text>
          </div>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSliderChange}
            tooltip={{ formatter: (value) => formatDuration(value || 0) }}
          />
        </Space>
      </div>
    </div>
  );
}; 