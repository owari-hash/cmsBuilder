import React from 'react';

interface UnknownComponentProps {
  componentType: string;
  instanceId?: string;
  reason?: string;
}

export const UnknownComponent: React.FC<UnknownComponentProps> = ({
  componentType,
  instanceId,
  reason
}) => {
  return (
    <div className="p-4 border-2 border-dashed border-amber-400 bg-amber-50 text-amber-800 rounded">
      <strong>Unsupported Component</strong>
      <p className="text-sm mt-1">Type: "{componentType}"</p>
      {instanceId ? <p className="text-xs mt-1 opacity-80">Instance: {instanceId}</p> : null}
      {reason ? <p className="text-xs mt-2">{reason}</p> : null}
    </div>
  );
};
