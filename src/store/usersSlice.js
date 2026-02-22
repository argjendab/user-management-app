import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    sortField: null,
    sortDirection: 'asc',
    searchQuery: '',
  },
  reducers: {
    addUser: (state, action) => { state.list.unshift(action.payload); },
    updateUser: (state, action) => {
      const idx = state.list.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter(u => u.id !== action.payload);
    },
    setSort: (state, action) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setSearch: (state, action) => { state.searchQuery = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser, setSort, setSearch } = usersSlice.actions;

// Input selectors — each returns a primitive or stable reference
const selectList          = (state) => state.users.list;
const selectSearchQuery   = (state) => state.users.searchQuery;
const selectSortField     = (state) => state.users.sortField;
const selectSortDirection = (state) => state.users.sortDirection;

// createSelector caches the result and only recomputes when an input changes,
// so the returned array reference stays the same across renders when nothing changed.
export const selectFilteredSortedUsers = createSelector(
  [selectList, selectSearchQuery, selectSortField, selectSortDirection],
  (list, searchQuery, sortField, sortDirection) => {
    let filtered = list.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = sortField === 'company' ? a.company?.name : a[sortField];
        let bVal = sortField === 'company' ? b.company?.name : b[sortField];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        aVal = String(aVal ?? '').toLowerCase();
        bVal = String(bVal ?? '').toLowerCase();

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }
);

export default usersSlice.reducer;