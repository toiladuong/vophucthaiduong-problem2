import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

const theme = extendTheme({
  // colorSchemes: {
  //   light: {
  //     palette: {
  //       primary: {
  //         main: "#fff",
  //       },
  //     },
  //   },
  //   dark: {
  //     palette: {
  //       primary: {
  //         main: "#fff",
  //       },
  //     },
  //   },
  // },
  typography: { fontFamily: "Oxanium" },
  components: {
    fontFamily: "Oxanium",
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            boderRaius: "8px",
            color: "#b2bec3",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            color: "#74b9ff",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          color: "white",
          ".MuiFormLabel-root": {
            color: 'white'
          },
          ".MuiInputBase-root": {
            boderRaius: '3px',
            background: 'linear-gradient(94deg,#a93eff,#5e40de 51%,#00b3ff)',

          },
          '.MuiAutocomplete-popper': {
            zIndex: '99999 !important'
          },
          // border: '3px solid linear-gradient(94deg,#a93eff,#5e40de 51%,#00b3ff)',
          // background: 'linear-gradient(#0e0e2a,#0e0e2a) padding-box,linear-gradient(90deg,#a93eff,#5e40de,#00b3ff) border-box;',
          "&.Mui-focused .MuiInputLabel-outlined": {
            color: "#f5a623"
          },
          "&.Mui-focused .MuiOutlinedInput-root": {
            border: 'none',
          }

        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: "white",
          '.MuiInputBase-root': {
            color: '#f5a623'
          },
          '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
            // Default left padding is 6px
            paddingLeft: 26
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "green"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
          },
          ".MuiInputBase-input-MuiOutlinedInput-input": {
            color: 'white'
          },
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#f5a623',

          '&.Mui-focused': {
            color: '#b25aff'
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "white !important",
          fontSize: '28px',
          fontWeight: '500',
          '.MuiInputBase-input-MuiOutlinedInput-input': {
            fontSize: '16px !important',
          },
          // '.MuiInput-underline': {
          //   fontSize: '28px !important',
          // },
          '&:after': {
            borderBottom: '3px solid #f5a623 !important'
          },
          '&:before': {
            borderBottom: '3px solid #b25aff !important'
          }

        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#f5a623 !important",
          fontSize: '15px',
          padding: '6px !important',
          minWidth: '120px',
          fontWeight: '400'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {

        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5a623 !important',
          boderRaius: '6px !important',
          '.MuiPaper-root': {
            backgroundColor: '#f5a623 !important',
            color: '#30185b',
            fontWeight: '600',
            fontSize: '16px',
            boderRaius: '6px !important',
          }

        }
      }
    }
  },
})

export default theme
