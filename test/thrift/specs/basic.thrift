namespace js basic

struct HelloWorld {
    1: string message;
}

service thrift_service {


    /**
     * Retrieve something in a map
     */
    map<string, double> get_a_map(1:list<string> mapkeys),

    /**
     * Add two numbers
     */
    i64 add_integers(1: i64 x, 2: i64 y)
}
