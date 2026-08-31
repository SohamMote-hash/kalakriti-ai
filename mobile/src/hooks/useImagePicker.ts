import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export function useImagePicker() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  }

  function reset() {
    setImageUri(null);
  }

  return { imageUri, pickFromCamera, pickFromGallery, reset };
}
