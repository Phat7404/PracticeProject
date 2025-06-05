'use client';

import { Card, Typography, Space, Tag } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Track } from '@/types/track';
import { formatDuration } from '@/lib/utils/format';

const { Title, Text } = Typography;

interface TrackCardProps {
  track: Track;
  onPlay?: (track: Track) => void;
}

export const TrackCard = ({ track, onPlay }: TrackCardProps) => {
  return (
    <Card
      hoverable
      cover={
        <div className="relative aspect-square">
          <img
            alt={track.title}
            src={track.coverArt || '/images/default-cover.png'}
            className="w-full h-full object-cover"
          />
          {onPlay && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => onPlay(track)}
            >
              <PlayCircleOutlined className="text-4xl text-white" />
            </div>
          )}
        </div>
      }
    >
      <Card.Meta
        title={
          <Title level={5} className="mb-1">
            {track.title}
          </Title>
        }
        description={
          <Space direction="vertical" size={4}>
            <Text type="secondary" ellipsis>
              {track.description}
            </Text>
            <Space>
              <ClockCircleOutlined />
              <Text type="secondary">{formatDuration(track.duration)}</Text>
            </Space>
            {track.genre && (
              <Tag color="blue">{track.genre}</Tag>
            )}
            {track.tags?.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        }
      />
    </Card>
  );
}; 