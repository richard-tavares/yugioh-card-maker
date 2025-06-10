import { useCallback } from "react";

export function useSerialInputValidator() {
    const validate = useCallback((value: string): string => {
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.slice(0, 8);
    }, []);

    return validate;
}
