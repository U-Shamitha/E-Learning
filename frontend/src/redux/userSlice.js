import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = 
{
    userDetails: {},
    activeTab: 'home',
    isSideBarOpen: false,
    selectedCourse: '',
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async() =>{
        try{
            let data = JSON.parse(localStorage.getItem('currentUser'));
            return data;
        }catch(error){

        }
    }
)

export const fetchSelectedCourse = createAsyncThunk(
  'user/fetchSelectedCourse',
  async() =>{
      try{
          let data = JSON.parse(localStorage.getItem('selectedCourse'));
          return data;
      }catch(error){

      }
  }
)

export const setUser = createAsyncThunk(
    'user/setUser',
    async (data) => {
      return data
    }
  )

  export const setActiveTab = createAsyncThunk(
    'user/setActiveTab',
    async (data) => {
      return data
    }
  )

  export const setIsSideBarOpen = createAsyncThunk(
    'user/setIsSideBarOpen',
    async (data) => {
      return data
    }
  )

  export const setSelectedCourse = createAsyncThunk(
    'user/setSelectedCourse',
    async (data) => {
      return data
    }
  )

  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(fetchUser.pending, (state)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action)=>{
            state.userDetails = action.payload;
        })
        builder.addCase(fetchUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        })
        builder.addCase(fetchSelectedCourse.pending, (state)=>{
          state.isLoading = true;
        })
        builder.addCase(fetchSelectedCourse.fulfilled, (state, action)=>{
            state.selectedCourse = action.payload;
        })
        builder.addCase(fetchSelectedCourse.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.error.message;
        })
        builder.addCase(setUser.fulfilled, (state, action)=>{
            state.userDetails = action.payload;
        })
        builder.addCase(setActiveTab.fulfilled, (state, action)=>{
            state.activeTab = action.payload;
        })
        builder.addCase(setIsSideBarOpen.fulfilled, (state, action)=>{
            state.isSideBarOpen = action.payload;
        })
        builder.addCase(setSelectedCourse.fulfilled, (state, action)=>{
          state.selectedCourse = action.payload;
        })
    }
  });

  export default userSlice.reducer;