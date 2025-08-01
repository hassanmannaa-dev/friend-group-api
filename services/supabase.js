const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing. Media uploads will not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  static async uploadMedia(file, fileName) {
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase not configured');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueFileName);

      return {
        success: true,
        url: urlData.publicUrl,
        fileName: uniqueFileName
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteMedia(fileName) {
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Supabase delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = SupabaseService; 