package com.rmiller;

import android.arch.persistence.room.Database;
import android.arch.persistence.room.RoomDatabase;
import android.arch.persistence.room.Room;
import android.content.Context;

@Database(entities = {User.class}, version = 1, exportSchema = false)
public abstract class NearbyDatabase extends RoomDatabase {
  private static NearbyDatabase _instance;
  public abstract UserDao userDao();

  public static NearbyDatabase getDatabase(final Context context) {
    if (_instance == null) {
      synchronized (NearbyDatabase.class) {
        if (_instance == null) {
          _instance = Room.databaseBuilder(context,
                        NearbyDatabase.class, "nearby_database").build();
        }
      }
    }

    return _instance;
  }
}
