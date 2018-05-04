package com.rmiller;

import android.content.Context;
import android.os.AsyncTask;
import com.rmiller.UserDao;
import com.rmiller.NearbyDatabase;

public class NearbyRepository {
  private UserDao dao;

  NearbyRepository(Context context) {
    NearbyDatabase db = NearbyDatabase.getDatabase(context);
    this.dao = db.userDao();
  }

  public User get() {
    return this.dao.getUser();
  }

  public void insert(User user) {
    new insertAsyncTask(this.dao).execute(user);
  }

  private static class insertAsyncTask extends AsyncTask<User, Void, Void> {
    private UserDao dao;

    insertAsyncTask(UserDao dao) {
      this.dao = dao;
    }

    @Override
    protected Void doInBackground(final User... params) {
      this.dao.insertAll(params[0]);
      return null;
    }
  }
}
