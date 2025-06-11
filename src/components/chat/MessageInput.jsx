import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Send, Mic, Image, Smile } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { storageService } from '../../services/storageService.js';
import { APP_CONFIG } from '../../utils/constants.js';

export const MessageInput = ({ onSendMessage }) => {
  const { isVIP } = useAuth();
  const { currentRoom } = useChat();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSendText = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (message.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
      alert(`El mensaje no puede tener más de ${APP_CONFIG.MAX_MESSAGE_LENGTH} caracteres`);
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = storageService.validateFile(
      file,
      APP_CONFIG.SUPPORTED_IMAGE_TYPES,
      APP_CONFIG.MAX_FILE_SIZE
    );

    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    
    try {
      const result = await storageService.uploadImage(
        user.uid,
        file,
        currentRoom.id
      );

      if (result.success) {
        onSendMessage('Imagen', 'image', result.url);
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const startRecording = async () => {
    if (!isVIP) {
      alert('Los audios son una función exclusiva para usuarios VIP');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        setUploading(true);
        
        try {
          const result = await storageService.uploadAudio(
            user.uid,
            audioBlob,
            currentRoom.id
          );

          if (result.success) {
            onSendMessage('Audio', 'audio', result.url);
          } else {
            alert('Error al subir el audio');
          }
        } catch (error) {
          console.error('Error uploading audio:', error);
          alert('Error al subir el audio');
        } finally {
          setUploading(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Auto-stop after max duration
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, APP_CONFIG.MAX_AUDIO_DURATION * 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const commonEmojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥'];

  return (
    <div className="space-y-3">
      {/* Emoji Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {commonEmojis.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            className="text-lg hover:bg-white hover:bg-opacity-20 text-white flex-shrink-0"
            onClick={() => addEmoji(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendText} className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {/* Image Upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Audio Recording */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={uploading}
            className={`${
              isRecording 
                ? 'text-red-400 hover:text-red-500 animate-pulse' 
                : isVIP 
                  ? 'text-white hover:text-white hover:bg-white hover:bg-opacity-20' 
                  : 'text-gray-400 cursor-not-allowed'
            }`}
            title={!isVIP ? 'Función VIP' : isRecording ? 'Detener grabación' : 'Grabar audio'}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={uploading ? 'Subiendo archivo...' : 'Escribí tu mensaje...'}
          disabled={uploading || isRecording}
          maxLength={APP_CONFIG.MAX_MESSAGE_LENGTH}
          className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
        />

        <Button
          type="submit"
          size="sm"
          disabled={!message.trim() || uploading || isRecording}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Character Counter */}
      {message.length > APP_CONFIG.MAX_MESSAGE_LENGTH * 0.8 && (
        <div className="text-xs text-right text-white text-opacity-70">
          {message.length}/{APP_CONFIG.MAX_MESSAGE_LENGTH}
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="text-center text-red-400 text-sm animate-pulse">
          🔴 Grabando audio... (máx. {APP_CONFIG.MAX_AUDIO_DURATION}s)
        </div>
      )}
    </div>
  );
};


