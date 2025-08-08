update-py-deps-windows:
	@bazelisk run //:generate_requirements_windows_txt.update

update-py-deps:
	@bazelisk run //:generate_requirements_lock

update-py-manifest:
	@bazelisk run //:gazelle_python_manifest.update

clean:
	@bazelisk clean 