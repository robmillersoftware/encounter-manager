package com.rmiller;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Query;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.Delete;

@Dao
public interface UserDao {
  @Query("SELECT * FROM user LIMIT 1")
  User getUser();

  @Insert
  void insertAll(User... users);

  @Delete
  void delete(User user);
}
